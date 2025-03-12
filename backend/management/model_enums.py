from enum import Enum

class HRDCLocation(Enum):
    BOZEMAN = "Bozeman"
    LIVINGSTON = "Livingston"


class InventoryCategory(Enum):
    PAPER_PRODUCT = "Paper Product"
    PPE = "PPE"
    TOILETRIES = "Toiletries"
    OFFICE_SUPPLIES = "Office Supplies"
