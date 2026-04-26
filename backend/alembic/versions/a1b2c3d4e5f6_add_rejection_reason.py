"""add rejection_reason to reservations

Revision ID: a1b2c3d4e5f6
Revises: 454bc4d773cd
Create Date: 2026-04-27 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = 'a1b2c3d4e5f6'
down_revision: Union[str, None] = '454bc4d773cd'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('reservations', sa.Column('rejection_reason', sa.String(), nullable=True))


def downgrade() -> None:
    op.drop_column('reservations', 'rejection_reason')
