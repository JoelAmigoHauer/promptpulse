from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Float, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database import Base

class Brand(Base):
    __tablename__ = "brands"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    keywords = Column(JSON)  # JSON array of keywords
    user_id = Column(Integer, ForeignKey("users.id"))
    industry = Column(String(100))
    website_url = Column(String(500))
    current_visibility_score = Column(Float, default=0.0)
    total_mentions = Column(Integer, default=0)
    avg_sentiment_score = Column(Float, default=3.0)
    last_analysis_date = Column(DateTime(timezone=True))
    is_active = Column(Integer, default=1)  # 1 = active, 0 = inactive
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    user = relationship("User")
    mentions = relationship("BrandMention", back_populates="brand")
    analysis_reports = relationship("BrandAnalysisReport", back_populates="brand")
    trend_analyses = relationship("BrandTrendAnalysis", back_populates="brand")
    alerts = relationship("BrandAlert", back_populates="brand")
    source_tracking = relationship("BrandSourceTracking", back_populates="brand")
