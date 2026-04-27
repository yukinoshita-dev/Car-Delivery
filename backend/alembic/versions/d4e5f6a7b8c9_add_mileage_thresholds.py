"""add mileage_thresholds table

Revision ID: d4e5f6a7b8c9
Revises: c3d4e5f6a7b8
Create Date: 2026-04-27 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = 'd4e5f6a7b8c9'
down_revision: Union[str, None] = 'c3d4e5f6a7b8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'mileage_thresholds',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('km', sa.Float(), nullable=False),
        sa.Column('amount', sa.Float(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_mileage_thresholds_id'), 'mileage_thresholds', ['id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_mileage_thresholds_id'), table_name='mileage_thresholds')
    op.drop_table('mileage_thresholds')
