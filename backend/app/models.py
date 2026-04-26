from sqlalchemy import Column, String, DateTime, Text, ForeignKey, Integer
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base
import uuid


def cuid():
    return f"cl{uuid.uuid4().hex[:22]}"


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=cuid)
    name = Column(String, nullable=True)
    email = Column(String, unique=True, nullable=True)
    email_verified = Column(DateTime, nullable=True)
    image = Column(String, nullable=True)
    password = Column(String, nullable=True)
    role = Column(String, default="user")
    created_at = Column(DateTime, default=datetime.utcnow)
    organization_id = Column(String, ForeignKey("organizations.id", ondelete="SET NULL"), nullable=True)

    accounts = relationship("Account", back_populates="user", cascade="all, delete-orphan")
    sessions = relationship("Session", back_populates="user", cascade="all, delete-orphan")
    conversations = relationship("Conversation", back_populates="user")
    owned_organizations = relationship(
        "Organization", 
        back_populates="owner", 
        primaryjoin="User.id == Organization.owner_id",
        foreign_keys="Organization.owner_id"
    )
    audio_records = relationship(
        "AudioRecord", 
        back_populates="user", 
        cascade="all, delete-orphan",
        primaryjoin="User.id == AudioRecord.user_id",
        foreign_keys="AudioRecord.user_id"
    )


class AudioRecord(Base):
    __tablename__ = "audio_records"

    id = Column(String, primary_key=True, default=cuid)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    organization_id = Column(String, ForeignKey("organizations.id", ondelete="SET NULL"), nullable=True)
    filename = Column(String, nullable=True)
    original_filename = Column(String, nullable=True)
    file_url = Column(String, nullable=True)
    original_url = Column(String, nullable=False)
    cleared_url = Column(String, nullable=True)
    status = Column(String, default="processing")
    tool_type = Column(String, nullable=False)  # isolator, tts, etc.
    ai_insight = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship(
        "User", 
        back_populates="audio_records", 
        primaryjoin="AudioRecord.user_id == User.id",
        foreign_keys=[user_id]
    )


class Organization(Base):
    __tablename__ = "organizations"

    id = Column(String, primary_key=True, default=cuid)
    name = Column(String, nullable=False)
    logo_url = Column(String, nullable=True)
    plan = Column(String, default="enterprise")
    owner_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship(
        "User", 
        back_populates="owned_organizations", 
        primaryjoin="Organization.owner_id == User.id",
        foreign_keys=[owner_id]
    )


class Account(Base):
    __tablename__ = "accounts"

    id = Column(String, primary_key=True, default=cuid)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    type = Column(String, nullable=False)
    provider = Column(String, nullable=False)
    provider_account_id = Column(String, nullable=False)
    refresh_token = Column(String, nullable=True)
    access_token = Column(String, nullable=True)
    expires_at = Column(Integer, nullable=True)
    token_type = Column(String, nullable=True)
    scope = Column(String, nullable=True)
    id_token = Column(Text, nullable=True)
    session_state = Column(String, nullable=True)

    user = relationship("User", back_populates="accounts")

    __table_args__ = ({"sqlite_autoincrement": True},)


class Session(Base):
    __tablename__ = "sessions"

    id = Column(String, primary_key=True, default=cuid)
    session_token = Column(String, unique=True, nullable=False)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    expires = Column(DateTime, nullable=False)

    user = relationship("User", back_populates="sessions")


class Conversation(Base):
    __tablename__ = "conversations"

    id = Column(String, primary_key=True, default=cuid)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    channel = Column(String, default="voice")
    language = Column(String, default="en")
    user_name = Column(String, nullable=True)
    user_phone = Column(String, nullable=True)
    issue_type = Column(String, nullable=True)
    status = Column(String, default="open")
    summary = Column(Text, nullable=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)

    user = relationship("User", back_populates="conversations")
    transcript = relationship("Message", back_populates="conversation", cascade="all, delete-orphan")


class Message(Base):
    __tablename__ = "messages"

    id = Column(String, primary_key=True, default=cuid)
    created_at = Column(DateTime, default=datetime.utcnow)
    role = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    conversation_id = Column(String, ForeignKey("conversations.id", ondelete="CASCADE"), nullable=False)

    conversation = relationship("Conversation", back_populates="transcript")


class KnowledgeDoc(Base):
    __tablename__ = "knowledge_docs"

    id = Column(String, primary_key=True, default=cuid)
    created_at = Column(DateTime, default=datetime.utcnow)
    title = Column(String, nullable=False)
    category = Column(String, nullable=False)
    language = Column(String, default="en")
    source = Column(String, nullable=True)
    content = Column(Text, nullable=False)
    tags_json = Column(Text, default="[]")
    qdrant_id = Column(String, nullable=True)


class VoiceSession(Base):
    __tablename__ = "voice_sessions"

    id = Column(String, primary_key=True, default=cuid)
    created_at = Column(DateTime, default=datetime.utcnow)
    provider = Column(String, default="vapi")
    assistant_id = Column(String, nullable=True)
    call_id = Column(String, nullable=True)
    status = Column(String, default="queued")
    notes = Column(Text, nullable=True)
