"""
Migration script to change generated_image_url from String(255) to Text
This allows storing base64 data URLs which can be very long
"""
from sqlalchemy import create_engine, text
import config

def migrate():
    engine = create_engine(config.POSTGRES_URL)
    
    with engine.connect() as conn:
        try:
            # PostgreSQL: Change column type to TEXT
            conn.execute(text("""
                ALTER TABLE summaries 
                ALTER COLUMN generated_image_url TYPE TEXT;
            """))
            conn.commit()
            print("✅ Migration successful: generated_image_url changed to TEXT")
        except Exception as e:
            print(f"⚠️  Migration error: {str(e)}")
            print("   This is OK if the column is already TEXT or doesn't exist")

if __name__ == "__main__":
    migrate()
