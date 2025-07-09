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
