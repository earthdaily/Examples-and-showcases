
class ImageReference:

    def __init__(self, image_id, image_date, image_sensor, season_field_id):
        self.image_id = image_id
        self.image_date = image_date
        self.image_sensor = image_sensor
        self.season_field_id = season_field_id

    def __str__(self):
        return f"{self.image_date} - {self.image_id} - {self.image_sensor}"
