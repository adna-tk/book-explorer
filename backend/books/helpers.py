"""
Helper functions for the books app.
"""


def format_choices(choices):
    """
    Format Django model choices into a list of dictionaries with value and label.
    
    Args:
        choices: A list of tuples in the format [(value, label), ...]
        
    Returns:
        A list of dictionaries in the format [{"value": value, "label": label}, ...]
        
    Example:
        >>> choices = [("fiction", "Fiction"), ("fantasy", "Fantasy")]
        >>> format_choices(choices)
        [{"value": "fiction", "label": "Fiction"}, {"value": "fantasy", "label": "Fantasy"}]
    """
    return [{"value": value, "label": label} for value, label in choices]
