"""
Base model class for the Tailspin Toys Crowdfunding platform.

This module provides the BaseModel class with common functionality for all database models.
"""
# filepath: server/models/base.py
from . import db

class BaseModel(db.Model):
    """Base model class providing common functionality for all database models."""
    __abstract__ = True
    
    @staticmethod
    def validate_string_length(field_name, value, min_length=2, allow_none=False):
        """
        Validates that a string field meets minimum length requirements.
        
        Args:
            field_name (str): Name of the field being validated
            value (str or None): The value to validate
            min_length (int): Minimum required length (default: 2)
            allow_none (bool): Whether None values are allowed (default: False)
            
        Returns:
            str: The validated value
            
        Raises:
            ValueError: If validation fails
        """
        if value is None:
            if allow_none:
                return value
            else:
                raise ValueError(f"{field_name} cannot be empty")
        
        if not isinstance(value, str):
            raise ValueError(f"{field_name} must be a string")
            
        if len(value.strip()) < min_length:
            raise ValueError(f"{field_name} must be at least {min_length} characters")
            
        return value