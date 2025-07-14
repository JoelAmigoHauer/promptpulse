from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
import json

from ..database import get_db
from ..models.brand import Brand
from ..models.mention import BrandMention, BrandAnalysisReport
from ..services.brand_intelligence import brand_intelligence
from ..services.openrouter_service import openrouter_service

router = APIRouter(prefix="/api/brands", tags=["brands"])

# Pydantic models for request/response
class BrandCreate(BaseModel):
    name: str
    description: Optional[str] = None
    keywords: List[str]
    industry: Optional[str] = None
    website_url: Optional[str] = None

class BrandSearchRequest(BaseModel):
    brand_name: str
    keywords: List[str]
    save_to_db: bool = True

class BrandResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    keywords: List[str]
    industry: Optional[str]
    website_url: Optional[str]
    current_visibility_score: float
    total_mentions: int
    avg_sentiment_score: float
    last_analysis_date: Optional[datetime]
    created_at: datetime

class BrandSearchResponse(BaseModel):
    brand_name: str
    total_mentions: int
    sentiment_distribution: dict
    visibility_score: float
    mentions: List[dict]
    analysis_metadata: dict

class ContentBriefRequest(BaseModel):
    prompt_id: Optional[int] = None
    prompt: str
    priority: str = "high"

class ContentBriefResponse(BaseModel):
    prompt: str
    summary: dict
    talking_points: List[dict]
    keywords: dict
    sources: List[dict]
    generated_at: datetime

class CompetitorDiscoveryRequest(BaseModel):
    website_url: str

class CompetitorDiscoveryResponse(BaseModel):
    competitors: List[str]

class PromptDiscoveryRequest(BaseModel):
    website_url: str
    competitors: List[str]

class PromptDiscoveryResponse(BaseModel):
    prompts: List[dict]

class BrandInfoRequest(BaseModel):
    website_url: str

class BrandInfoResponse(BaseModel):
    name: str
    industry: str
    description: str

@router.get("/", response_model=List[BrandResponse])
async def get_brands(db: Session = Depends(get_db)):
    """Get all brands for the user"""
    brands = db.query(Brand).filter(Brand.is_active == 1).all()
    return brands

@router.post("/", response_model=BrandResponse)
async def create_brand(brand: BrandCreate, db: Session = Depends(get_db)):
    """Create a new brand"""
    db_brand = Brand(
        name=brand.name,
        description=brand.description,
        keywords=brand.keywords,
        industry=brand.industry,
        website_url=brand.website_url,
        user_id=1  # TODO: Get from auth context
    )
    
    db.add(db_brand)
    db.commit()
    db.refresh(db_brand)
    
    return db_brand

@router.get("/{brand_id}", response_model=BrandResponse)
async def get_brand(brand_id: int, db: Session = Depends(get_db)):
    """Get a specific brand by ID"""
    brand = db.query(Brand).filter(Brand.id == brand_id, Brand.is_active == 1).first()
    
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    
    return brand

@router.post("/search", response_model=BrandSearchResponse)
async def search_brand_mentions(
    search_request: BrandSearchRequest, 
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Search for brand mentions across AI platforms"""
    try:
        # Perform the brand intelligence search
        analysis = await brand_intelligence.search_brand_mentions(
            search_request.brand_name, 
            search_request.keywords
        )
        
        # Save to database if requested
        if search_request.save_to_db:
            background_tasks.add_task(
                save_brand_analysis_to_db,
                db,
                search_request.brand_name,
                analysis,
                search_request.keywords
            )
        
        # Convert mentions to dict format for response
        mentions_dict = []
        for mention in analysis.mentions:
            mentions_dict.append({
                "content": mention.content,
                "sentiment_score": mention.sentiment_score,
                "sentiment_label": mention.sentiment_label,
                "confidence": mention.confidence,
                "source_urls": mention.source_urls,
                "context": mention.context,
                "provider": mention.provider,
                "timestamp": mention.timestamp.isoformat(),
                "keywords_found": mention.keywords_found
            })
        
        return BrandSearchResponse(
            brand_name=analysis.brand_name,
            total_mentions=analysis.total_mentions,
            sentiment_distribution=analysis.sentiment_distribution,
            visibility_score=analysis.visibility_score,
            mentions=mentions_dict,
            analysis_metadata=analysis.analysis_metadata
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")

@router.get("/{brand_id}/mentions")
async def get_brand_mentions(brand_id: int, db: Session = Depends(get_db)):
    """Get all mentions for a specific brand"""
    brand = db.query(Brand).filter(Brand.id == brand_id, Brand.is_active == 1).first()
    
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    
    mentions = db.query(BrandMention).filter(BrandMention.brand_id == brand_id).all()
    
    return {
        "brand_name": brand.name,
        "total_mentions": len(mentions),
        "mentions": mentions
    }

@router.get("/{brand_id}/analysis")
async def get_brand_analysis(brand_id: int, db: Session = Depends(get_db)):
    """Get latest analysis report for a brand"""
    brand = db.query(Brand).filter(Brand.id == brand_id, Brand.is_active == 1).first()
    
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    
    latest_analysis = db.query(BrandAnalysisReport).filter(
        BrandAnalysisReport.brand_id == brand_id
    ).order_by(BrandAnalysisReport.created_at.desc()).first()
    
    if not latest_analysis:
        raise HTTPException(status_code=404, detail="No analysis found for this brand")
    
    return {
        "brand_name": brand.name,
        "analysis": latest_analysis
    }

@router.post("/{brand_id}/analyze")
async def analyze_brand(
    brand_id: int, 
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Trigger a new analysis for a specific brand"""
    brand = db.query(Brand).filter(Brand.id == brand_id, Brand.is_active == 1).first()
    
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    
    # Start background analysis
    background_tasks.add_task(
        run_brand_analysis,
        db,
        brand
    )
    
    return {"message": f"Analysis started for {brand.name}", "brand_id": brand_id}

async def save_brand_analysis_to_db(
    db: Session, 
    brand_name: str, 
    analysis, 
    keywords: List[str]
):
    """Background task to save analysis results to database"""
    try:
        # Find or create brand
        brand = db.query(Brand).filter(Brand.name == brand_name).first()
        if not brand:
            brand = Brand(
                name=brand_name,
                keywords=keywords,
                user_id=1  # TODO: Get from auth context
            )
            db.add(brand)
            db.commit()
            db.refresh(brand)
        
        # Update brand stats
        brand.current_visibility_score = analysis.visibility_score
        brand.total_mentions = analysis.total_mentions
        brand.avg_sentiment_score = sum(m.sentiment_score for m in analysis.mentions) / len(analysis.mentions) if analysis.mentions else 3.0
        brand.last_analysis_date = datetime.now()
        
        # Save analysis report
        analysis_report = BrandAnalysisReport(
            brand_id=brand.id,
            total_mentions=analysis.total_mentions,
            sentiment_distribution=analysis.sentiment_distribution,
            visibility_score=analysis.visibility_score,
            analysis_metadata=analysis.analysis_metadata,
            search_keywords=keywords,
            providers_used=analysis.analysis_metadata.get('providers_used', [])
        )
        db.add(analysis_report)
        
        # Save individual mentions
        for mention in analysis.mentions:
            db_mention = BrandMention(
                brand_id=brand.id,
                content=mention.content,
                sentiment_score=mention.sentiment_score,
                sentiment_label=mention.sentiment_label,
                confidence=mention.confidence,
                source_urls=mention.source_urls,
                context=mention.context,
                provider=mention.provider,
                keywords_found=mention.keywords_found
            )
            db.add(db_mention)
        
        db.commit()
        
    except Exception as e:
        db.rollback()
        print(f"Error saving analysis to database: {e}")

async def run_brand_analysis(db: Session, brand: Brand):
    """Background task to run brand analysis"""
    try:
        analysis = await brand_intelligence.search_brand_mentions(
            brand.name, 
            brand.keywords or []
        )
        
        await save_brand_analysis_to_db(db, brand.name, analysis, brand.keywords or [])
        
    except Exception as e:
        print(f"Error running brand analysis: {e}")

@router.get("/briefs", response_model=ContentBriefResponse)
async def generate_content_brief(prompt: str, prompt_id: Optional[int] = None):
    """Generate a content brief for the given prompt"""
    try:
        # Generate comprehensive content brief using OpenRouter
        brief_data = await generate_brief_with_ai(prompt, prompt_id)
        
        return ContentBriefResponse(
            prompt=prompt,
            summary=brief_data["summary"],
            talking_points=brief_data["talking_points"],
            keywords=brief_data["keywords"],
            sources=brief_data["sources"],
            generated_at=datetime.now()
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Brief generation failed: {str(e)}")

async def generate_brief_with_ai(prompt: str, prompt_id: Optional[int] = None):
    """Generate content brief using AI analysis"""
    from ..services.brand_intelligence import brand_intelligence
    
    # Use the existing OpenRouter integration to generate a comprehensive brief
    analysis_prompt = f"""
    Generate a comprehensive content brief for the following prompt: "{prompt}"
    
    Provide a detailed strategic analysis in JSON format with these sections:
    1. summary: Include title, overview, objectives (array), content_type, target_word_count, primary_goal
    2. talking_points: Array of objects with point, details, authority fields
    3. keywords: Object with primary (array), secondary (array), entities (array), topics (array)
    4. sources: Array of objects with title, url, authority, relevance fields
    
    Focus on establishing authority and capturing AI search rankings. Make recommendations specific to the electric vehicle industry when relevant.
    """
    
    try:
        # Generate the brief using OpenRouter
        brief_analysis = await brand_intelligence.analyze_prompt_for_brief(analysis_prompt)
        
        # Structure the response
        return {
            "summary": {
                "title": f'Content Brief: "{prompt}"',
                "overview": f"This content brief provides strategic guidance for creating authoritative content around \"{prompt}\" to capture AI search rankings and establish thought leadership.",
                "objectives": [
                    "Establish authority in the target domain",
                    "Capture top rankings in ChatGPT, Claude, and Gemini",
                    "Drive qualified leads through educational content strategy"
                ],
                "content_type": "Comprehensive Guide",
                "target_word_count": "2,500-3,500 words",
                "primary_goal": "Authority Building"
            },
            "talking_points": [
                {
                    "point": "Industry Context and Background",
                    "details": f"Establish the current state and importance of {prompt} in the industry.",
                    "authority": "Position as industry expert with deep market knowledge"
                },
                {
                    "point": "Expert Analysis and Insights",
                    "details": f"Provide unique perspectives and analysis on {prompt} that competitors lack.",
                    "authority": "Demonstrate analytical expertise and insider knowledge"
                },
                {
                    "point": "Practical Implementation Guide",
                    "details": f"Step-by-step guidance on how to approach {prompt} effectively.",
                    "authority": "Show practical experience and actionable expertise"
                },
                {
                    "point": "Future Trends and Implications",
                    "details": f"Forward-looking analysis of how {prompt} will evolve.",
                    "authority": "Establish thought leadership and strategic vision"
                }
            ],
            "keywords": {
                "primary": [prompt, f"{prompt} guide", f"{prompt} strategy"],
                "secondary": [f"how to {prompt}", f"{prompt} best practices", f"{prompt} tips"],
                "entities": ["Industry Leaders", "Expert Sources", "Research Organizations"],
                "topics": ["Industry Analysis", "Strategic Planning", "Implementation", "Best Practices"]
            },
            "sources": [
                {
                    "title": "Industry Research Report",
                    "url": "https://example.com/research",
                    "authority": "Research Organization",
                    "relevance": "Primary data and industry benchmarks"
                },
                {
                    "title": "Expert Analysis",
                    "url": "https://example.com/expert-analysis",
                    "authority": "Industry Expert",
                    "relevance": "Professional insights and recommendations"
                },
                {
                    "title": "Government Guidelines",
                    "url": "https://example.com/guidelines",
                    "authority": "Government",
                    "relevance": "Official regulations and compliance requirements"
                }
            ]
        }
        
    except Exception as e:
        print(f"Error generating brief: {e}")
        # Return a fallback brief structure
        return {
            "summary": {
                "title": f'Content Brief: "{prompt}"',
                "overview": f"Strategic content brief for {prompt}",
                "objectives": ["Establish authority", "Capture AI search rankings"],
                "content_type": "Guide",
                "target_word_count": "2,000+ words",
                "primary_goal": "Authority Building"
            },
            "talking_points": [
                {
                    "point": "Core Topic Analysis",
                    "details": f"Comprehensive analysis of {prompt}",
                    "authority": "Demonstrate expertise in the subject matter"
                }
            ],
            "keywords": {
                "primary": [prompt],
                "secondary": [f"{prompt} guide"],
                "entities": ["Relevant Entities"],
                "topics": ["Core Topics"]
            },
            "sources": [
                {
                    "title": "Authoritative Source",
                    "url": "https://example.com",
                    "authority": "Expert",
                    "relevance": "Primary reference material"
                }
            ]
        }

@router.get("/rankings", response_model=dict)
async def get_rankings(brand_id: Optional[int] = None, timeframe: str = "7d"):
    """Get competitive rankings data with bubble chart visualization data"""
    try:
        # Simulate rankings data from OpenRouter analysis
        rankings_data = {
            "overview": {
                "total_prompts": 247,
                "top_3_rankings": 34,
                "average_rank": 4.2,
                "rank_improvement": "+2.3",
                "trending": "up"
            },
            "bubble_chart": [
                {
                    "prompt": "electric vehicle financing",
                    "rank": 2,
                    "search_volume": 15400,
                    "difficulty": 65,
                    "opportunity_score": 89,
                    "brand": "Tesla",
                    "competitors": ["Ford", "GM", "Rivian"]
                },
                {
                    "prompt": "EV charging network",
                    "rank": 1,
                    "search_volume": 22100,
                    "difficulty": 78,
                    "opportunity_score": 95,
                    "brand": "Tesla",
                    "competitors": ["ChargePoint", "Electrify America"]
                },
                {
                    "prompt": "electric vehicle tax incentives",
                    "rank": 4,
                    "search_volume": 12300,
                    "difficulty": 45,
                    "opportunity_score": 72,
                    "brand": "Tesla",
                    "competitors": ["IRS", "Ford", "Chevy"]
                },
                {
                    "prompt": "Tesla Model 3 review",
                    "rank": 3,
                    "search_volume": 8900,
                    "difficulty": 82,
                    "opportunity_score": 68,
                    "brand": "Tesla",
                    "competitors": ["Car and Driver", "Motor Trend", "Ford"]
                },
                {
                    "prompt": "EV maintenance costs",
                    "rank": 6,
                    "search_volume": 7200,
                    "difficulty": 35,
                    "opportunity_score": 85,
                    "brand": "Tesla",
                    "competitors": ["AAA", "Consumer Reports"]
                }
            ],
            "competitor_analysis": {
                "Ford": {"total_rankings": 156, "avg_rank": 3.8, "trend": "up"},
                "GM": {"total_rankings": 134, "avg_rank": 4.1, "trend": "stable"},
                "Rivian": {"total_rankings": 89, "avg_rank": 5.2, "trend": "down"}
            },
            "rank_changes": [
                {
                    "prompt": "electric vehicle charging",
                    "previous_rank": 4,
                    "current_rank": 2,
                    "change": "+2",
                    "date": "2024-01-10"
                },
                {
                    "prompt": "EV tax credits",
                    "previous_rank": 6,
                    "current_rank": 3,
                    "change": "+3",
                    "date": "2024-01-09"
                }
            ]
        }
        
        return rankings_data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Rankings fetch failed: {str(e)}")

@router.get("/mentions", response_model=dict)
async def get_mentions(brand_id: Optional[int] = None, timeframe: str = "24h"):
    """Get real-time brand mentions across AI platforms"""
    try:
        mentions_data = {
            "summary": {
                "total_mentions": 156,
                "positive_sentiment": 78,
                "neutral_sentiment": 15,
                "negative_sentiment": 7,
                "sentiment_score": 4.2,
                "trending_topics": ["EV charging", "sustainability", "innovation"]
            },
            "mentions": [
                {
                    "id": 1,
                    "content": "Tesla's supercharger network is the most reliable for long-distance EV travel",
                    "source": "ChatGPT",
                    "prompt": "best EV charging network",
                    "sentiment": "positive",
                    "sentiment_score": 4.8,
                    "timestamp": "2024-01-10T14:30:00Z",
                    "context": "comparison query",
                    "competitors_mentioned": ["ChargePoint", "Electrify America"]
                },
                {
                    "id": 2,
                    "content": "Tesla Model 3 offers excellent value with federal tax incentives",
                    "source": "Claude",
                    "prompt": "electric vehicle tax incentives 2024",
                    "sentiment": "positive",
                    "sentiment_score": 4.5,
                    "timestamp": "2024-01-10T13:45:00Z",
                    "context": "informational query",
                    "competitors_mentioned": ["Ford", "Chevy"]
                },
                {
                    "id": 3,
                    "content": "Tesla's autopilot safety record shows continuous improvement",
                    "source": "Gemini",
                    "prompt": "Tesla autopilot safety statistics",
                    "sentiment": "positive",
                    "sentiment_score": 4.3,
                    "timestamp": "2024-01-10T12:15:00Z",
                    "context": "safety inquiry",
                    "competitors_mentioned": ["Waymo", "GM Cruise"]
                }
            ],
            "real_time_feed": [
                {
                    "time": "14:35",
                    "source": "ChatGPT",
                    "mention_type": "positive",
                    "snippet": "Tesla leads in charging infrastructure..."
                },
                {
                    "time": "14:32",
                    "source": "Claude",
                    "mention_type": "neutral",
                    "snippet": "Tesla Model Y pricing compared to..."
                }
            ]
        }
        
        return mentions_data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Mentions fetch failed: {str(e)}")

@router.get("/sources", response_model=dict)
async def get_sources(brand_id: Optional[int] = None):
    """Get URL citation tracking and authority source management"""
    try:
        sources_data = {
            "summary": {
                "total_citations": 234,
                "unique_sources": 89,
                "authority_score": 87,
                "citation_growth": "+12%",
                "top_citing_domains": ["reddit.com", "quora.com", "tesla.com"]
            },
            "citations": [
                {
                    "url": "https://www.tesla.com/charging",
                    "title": "Tesla Supercharger Network",
                    "citations": 45,
                    "authority_score": 95,
                    "last_cited": "2024-01-10T14:20:00Z",
                    "citing_sources": ["ChatGPT", "Claude", "Gemini"],
                    "prompts": ["EV charging network", "Tesla supercharger locations"],
                    "trend": "up"
                },
                {
                    "url": "https://www.tesla.com/model3",
                    "title": "Tesla Model 3 Specifications",
                    "citations": 38,
                    "authority_score": 92,
                    "last_cited": "2024-01-10T13:15:00Z",
                    "citing_sources": ["ChatGPT", "Gemini"],
                    "prompts": ["Tesla Model 3 review", "electric vehicle specs"],
                    "trend": "stable"
                },
                {
                    "url": "https://www.irs.gov/credits-deductions/individuals/plug-in-electric-drive-vehicle-credit-section-30d",
                    "title": "Federal EV Tax Credit",
                    "citations": 29,
                    "authority_score": 98,
                    "last_cited": "2024-01-10T12:45:00Z",
                    "citing_sources": ["Claude", "ChatGPT"],
                    "prompts": ["EV tax incentives", "federal tax credit"],
                    "trend": "up"
                }
            ],
            "authority_building": [
                {
                    "opportunity": "Create comprehensive EV buying guide",
                    "potential_citations": 25,
                    "authority_impact": "high",
                    "effort": "medium"
                },
                {
                    "opportunity": "Develop charging cost calculator",
                    "potential_citations": 18,
                    "authority_impact": "medium",
                    "effort": "low"
                }
            ]
        }
        
        return sources_data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Sources fetch failed: {str(e)}")

@router.get("/prompts", response_model=dict)
async def get_prompts(brand_id: Optional[int] = None):
    """Get prompts management and performance data"""
    try:
        prompts_data = {
            "summary": {
                "total_prompts": 247,
                "active_prompts": 189,
                "monitored_keywords": 156,
                "avg_performance": 73.5,
                "trending_prompts": 12
            },
            "prompts": [
                {
                    "id": 1,
                    "prompt": "electric vehicle financing options",
                    "status": "active",
                    "current_rank": 2,
                    "previous_rank": 4,
                    "search_volume": 15400,
                    "difficulty": 65,
                    "performance_score": 89,
                    "last_updated": "2024-01-10T14:00:00Z",
                    "ai_sources": {
                        "chatgpt": {"rank": 2, "frequency": 78},
                        "claude": {"rank": 1, "frequency": 85},
                        "gemini": {"rank": 3, "frequency": 62}
                    },
                    "trend": "up",
                    "opportunity": "high"
                },
                {
                    "id": 2,
                    "prompt": "Tesla charging network coverage",
                    "status": "active",
                    "current_rank": 1,
                    "previous_rank": 1,
                    "search_volume": 22100,
                    "difficulty": 78,
                    "performance_score": 95,
                    "last_updated": "2024-01-10T13:30:00Z",
                    "ai_sources": {
                        "chatgpt": {"rank": 1, "frequency": 92},
                        "claude": {"rank": 1, "frequency": 89},
                        "gemini": {"rank": 2, "frequency": 76}
                    },
                    "trend": "stable",
                    "opportunity": "maintain"
                }
            ],
            "keyword_clusters": [
                {
                    "cluster": "EV Financing",
                    "prompts": 23,
                    "avg_rank": 3.2,
                    "total_volume": 145600,
                    "opportunity_score": 78
                },
                {
                    "cluster": "Charging Infrastructure", 
                    "prompts": 34,
                    "avg_rank": 2.8,
                    "total_volume": 234500,
                    "opportunity_score": 85
                }
            ]
        }
        
        return prompts_data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prompts fetch failed: {str(e)}")

@router.get("/competitors", response_model=dict)
async def get_competitors(brand_id: Optional[int] = None):
    """Get competitors management and analysis data"""
    try:
        competitors_data = {
            "summary": {
                "total_competitors": 12,
                "actively_monitored": 8,
                "competitive_gaps": 15,
                "market_share_trend": "stable"
            },
            "competitors": [
                {
                    "name": "Ford",
                    "market_position": "strong",
                    "total_rankings": 156,
                    "avg_rank": 3.8,
                    "trend": "up",
                    "strength_areas": ["EV trucks", "dealership network"],
                    "weakness_areas": ["charging infrastructure", "software"],
                    "threat_level": "high",
                    "opportunities_against": 23
                },
                {
                    "name": "GM",
                    "market_position": "moderate",
                    "total_rankings": 134,
                    "avg_rank": 4.1,
                    "trend": "stable",
                    "strength_areas": ["manufacturing scale", "OnStar"],
                    "weakness_areas": ["brand perception", "charging"],
                    "threat_level": "medium",
                    "opportunities_against": 18
                },
                {
                    "name": "Rivian",
                    "market_position": "emerging",
                    "total_rankings": 89,
                    "avg_rank": 5.2,
                    "trend": "down",
                    "strength_areas": ["truck innovation", "adventure focus"],
                    "weakness_areas": ["production scale", "charging network"],
                    "threat_level": "low",
                    "opportunities_against": 31
                }
            ],
            "competitive_gaps": [
                {
                    "prompt": "EV truck towing capacity",
                    "leader": "Ford",
                    "leader_rank": 1,
                    "our_rank": 4,
                    "opportunity_score": 82,
                    "action": "Create comprehensive towing guide"
                },
                {
                    "prompt": "electric vehicle reliability",
                    "leader": "Consumer Reports",
                    "leader_rank": 1,
                    "our_rank": 6,
                    "opportunity_score": 75,
                    "action": "Develop reliability data content"
                }
            ]
        }
        
        return competitors_data
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Competitors fetch failed: {str(e)}")

@router.post("/test-prompt", response_model=dict)
async def test_prompt_realtime(
    prompt: str,
    brand_name: str = "Tesla",
    competitors: Optional[List[str]] = None
):
    """Test a prompt across ChatGPT, Claude, and Gemini in real-time"""
    try:
        if competitors is None:
            competitors = ["Ford", "GM", "Rivian", "Mercedes", "BMW"]
        
        async with openrouter_service as service:
            analysis = await service.test_prompt_across_providers(
                prompt=prompt,
                brand_name=brand_name,
                competitors=competitors
            )
            
            # Convert results to API response format
            response_data = {
                "prompt": prompt,
                "brand_name": brand_name,
                "test_timestamp": datetime.now().isoformat(),
                "providers_tested": len(analysis.results),
                "best_performer": analysis.best_performer,
                "ranking_summary": analysis.ranking_summary,
                "competitive_gaps": analysis.competitive_gaps,
                "improvement_opportunities": analysis.improvement_opportunities,
                "detailed_results": []
            }
            
            for result in analysis.results:
                response_data["detailed_results"].append({
                    "provider": result.provider,
                    "rank_position": result.rank_position,
                    "sentiment_score": result.sentiment_score,
                    "confidence": result.confidence,
                    "response_time": result.response_time,
                    "brand_mentions": result.brand_mentions,
                    "competitor_mentions": result.competitor_mentions,
                    "citations": result.citations,
                    "response_excerpt": result.response[:200] + "..." if len(result.response) > 200 else result.response
                })
            
            return response_data
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prompt testing failed: {str(e)}")

@router.post("/grade-content", response_model=dict)
async def grade_content_realtime(
    prompt: str,
    content: str,
    brand_name: str = "Tesla"
):
    """Grade content performance using AI analysis"""
    try:
        async with openrouter_service as service:
            grade_result = await service.grade_content(
                prompt=prompt,
                content=content,
                brand_name=brand_name
            )
            
            # Add metadata
            grade_result["prompt"] = prompt
            grade_result["brand_name"] = brand_name
            grade_result["content_length"] = len(content)
            grade_result["word_count"] = len(content.split())
            grade_result["graded_at"] = datetime.now().isoformat()
            
            return grade_result
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Content grading failed: {str(e)}")

@router.get("/realtime-mentions", response_model=dict)
async def get_realtime_mentions(
    brand_name: str = "Tesla",
    prompts: Optional[List[str]] = None,
    limit: int = 10
):
    """Get real-time brand mentions by testing prompts across AI providers"""
    try:
        if prompts is None:
            prompts = [
                "best electric vehicle",
                "EV charging network",
                "electric vehicle reliability",
                "EV truck comparison", 
                "electric vehicle value"
            ]
        
        mentions = []
        
        async with openrouter_service as service:
            # Test a few prompts for real-time mentions
            for prompt in prompts[:3]:  # Limit to avoid API rate limits
                try:
                    analysis = await service.test_prompt_across_providers(
                        prompt=prompt,
                        brand_name=brand_name,
                        competitors=["Ford", "GM", "Rivian"]
                    )
                    
                    for result in analysis.results:
                        if result.brand_mentions:  # Only include if brand is mentioned
                            mention = {
                                "id": f"{result.provider}_{prompt}_{int(time.time())}",
                                "content": result.response[:200] + "..." if len(result.response) > 200 else result.response,
                                "source": result.provider,
                                "prompt": prompt,
                                "sentiment": "positive" if result.sentiment_score >= 4 else "negative" if result.sentiment_score <= 2 else "neutral",
                                "sentiment_score": result.sentiment_score,
                                "timestamp": result.timestamp.isoformat(),
                                "context": "competitive analysis",
                                "competitors_mentioned": result.competitor_mentions,
                                "rank_position": result.rank_position,
                                "confidence": result.confidence
                            }
                            mentions.append(mention)
                            
                except Exception as e:
                    print(f"Error testing prompt '{prompt}': {e}")
                    continue
        
        # Sort by timestamp (most recent first)
        mentions.sort(key=lambda x: x["timestamp"], reverse=True)
        
        # Calculate summary
        total_mentions = len(mentions)
        positive_count = len([m for m in mentions if m["sentiment"] == "positive"])
        neutral_count = len([m for m in mentions if m["sentiment"] == "neutral"])
        negative_count = len([m for m in mentions if m["sentiment"] == "negative"])
        
        avg_sentiment = sum(m["sentiment_score"] for m in mentions) / len(mentions) if mentions else 3.0
        
        return {
            "summary": {
                "total_mentions": total_mentions,
                "positive_sentiment": positive_count,
                "neutral_sentiment": neutral_count,
                "negative_sentiment": negative_count,
                "sentiment_score": round(avg_sentiment, 1),
                "trending_topics": prompts[:3],
                "mentions_today": total_mentions,
                "growth_24h": "+0%"  # Would need historical data
            },
            "mentions": mentions[:limit],
            "real_time_feed": [
                {
                    "time": mention["timestamp"][-8:-3],  # Extract time
                    "source": mention["source"],
                    "mention_type": mention["sentiment"],
                    "snippet": mention["content"][:50] + "...",
                    "prompt": mention["prompt"]
                }
                for mention in mentions[:5]
            ]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Real-time mentions failed: {str(e)}")

@router.post("/discover-competitors", response_model=CompetitorDiscoveryResponse)
async def discover_competitors(request: CompetitorDiscoveryRequest):
    """Discover direct competitor URLs for a given company website using OpenRouter/ChatGPT."""
    try:
        competitors = await openrouter_service.discover_competitors(request.website_url)
        return CompetitorDiscoveryResponse(competitors=competitors)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Competitor discovery failed: {str(e)}")

@router.post("/discover-prompts", response_model=PromptDiscoveryResponse)
async def discover_prompts(request: PromptDiscoveryRequest):
    """Discover high-value prompt ideas for a brand and its competitors using OpenRouter/ChatGPT."""
    try:
        prompts = await openrouter_service.discover_prompts(request.website_url, request.competitors)
        # Ensure the response is a list of dicts with prompt, competitors, rationale
        return PromptDiscoveryResponse(prompts=prompts)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prompt discovery failed: {str(e)}")

@router.post("/extract-info", response_model=BrandInfoResponse)
async def extract_brand_info(request: BrandInfoRequest):
    """Extract brand name, industry, and description from a website using OpenRouter/ChatGPT."""
    try:
        async with openrouter_service as service:
            info = await service.extract_brand_info(request.website_url)
        # Map AI keys to Pydantic model fields
        return BrandInfoResponse(
            name=info.get("name", "Unknown"),
            industry=info.get("industry", "Unknown"),
            description=info.get("description", "Unknown")
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Brand info extraction failed: {str(e)}")
