from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Float, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database import Base

class BrandMention(Base):
    __tablename__ = "brand_mentions"
    
    id = Column(Integer, primary_key=True, index=True)
    brand_id = Column(Integer, ForeignKey("brands.id"), nullable=False)
    content = Column(Text, nullable=False)
    sentiment_score = Column(Integer, nullable=False)  # 1-5 scale
    sentiment_label = Column(String(50), nullable=False)  # very_positive, positive, neutral, negative, very_negative
    confidence = Column(Float, nullable=False)  # 0.0-1.0
    source_urls = Column(JSON)  # List of URLs
    context = Column(Text)  # Shortened context
    provider = Column(String(50), nullable=False)  # openai, anthropic, google
    keywords_found = Column(JSON)  # List of keywords found
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationship to brand
    brand = relationship("Brand", back_populates="mentions")

class BrandAnalysisReport(Base):
    __tablename__ = "brand_analysis_reports"
    
    id = Column(Integer, primary_key=True, index=True)
    brand_id = Column(Integer, ForeignKey("brands.id"), nullable=False)
    total_mentions = Column(Integer, nullable=False)
    sentiment_distribution = Column(JSON, nullable=False)  # Dict with sentiment counts
    visibility_score = Column(Float, nullable=False)  # 0.0-100.0
    analysis_metadata = Column(JSON)  # Additional analysis data
    search_keywords = Column(JSON)  # Keywords used in search
    providers_used = Column(JSON)  # List of AI providers used
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationship to brand
    brand = relationship("Brand", back_populates="analysis_reports")

class BrandCompetitorAnalysis(Base):
    __tablename__ = "brand_competitor_analysis"
    
    id = Column(Integer, primary_key=True, index=True)
    brand_id = Column(Integer, ForeignKey("brands.id"), nullable=False)
    competitor_brand_id = Column(Integer, ForeignKey("brands.id"), nullable=True)
    competitor_name = Column(String(255), nullable=False)
    comparison_data = Column(JSON, nullable=False)  # Detailed comparison results
    market_position_score = Column(Float)  # Relative market position
    competitive_advantage_score = Column(Float)  # Competitive advantage rating
    analysis_keywords = Column(JSON)  # Keywords used in analysis
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    brand = relationship("Brand", foreign_keys=[brand_id])
    competitor_brand = relationship("Brand", foreign_keys=[competitor_brand_id])

class BrandTrendAnalysis(Base):
    __tablename__ = "brand_trend_analysis"
    
    id = Column(Integer, primary_key=True, index=True)
    brand_id = Column(Integer, ForeignKey("brands.id"), nullable=False)
    trend_period = Column(String(50), nullable=False)  # daily, weekly, monthly
    trend_data = Column(JSON, nullable=False)  # Trend metrics and patterns
    sentiment_trend = Column(JSON)  # Sentiment over time
    mention_volume_trend = Column(JSON)  # Volume trends
    visibility_trend = Column(JSON)  # Visibility score trends
    trend_insights = Column(Text)  # AI-generated insights
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationship to brand
    brand = relationship("Brand", back_populates="trend_analyses")

class BrandAlert(Base):
    __tablename__ = "brand_alerts"
    
    id = Column(Integer, primary_key=True, index=True)
    brand_id = Column(Integer, ForeignKey("brands.id"), nullable=False)
    alert_type = Column(String(50), nullable=False)  # sentiment_drop, volume_spike, negative_mention
    alert_severity = Column(String(20), nullable=False)  # low, medium, high, critical
    alert_message = Column(Text, nullable=False)
    alert_data = Column(JSON)  # Additional alert context
    is_resolved = Column(Integer, default=0)  # 0 = active, 1 = resolved
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    resolved_at = Column(DateTime(timezone=True))
    
    # Relationship to brand
    brand = relationship("Brand", back_populates="alerts")

class BrandSourceTracking(Base):
    __tablename__ = "brand_source_tracking"
    
    id = Column(Integer, primary_key=True, index=True)
    brand_id = Column(Integer, ForeignKey("brands.id"), nullable=False)
    source_url = Column(String(500), nullable=False)
    source_domain = Column(String(255), nullable=False)
    mention_count = Column(Integer, default=1)
    avg_sentiment_score = Column(Float)
    last_mention_date = Column(DateTime(timezone=True))
    source_credibility_score = Column(Float)  # 0.0-1.0
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationship to brand
    brand = relationship("Brand", back_populates="source_tracking")

# Update the Brand model to include new relationships
# This would be added to the existing Brand model in brand.py