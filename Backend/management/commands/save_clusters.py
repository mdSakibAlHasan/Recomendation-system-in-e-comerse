from django.core.management.base import BaseCommand
from recomendation.utils import save_clusters_to_db

class Command(BaseCommand):
    help = 'Cluster products based on title and description text and save clusters to database'

    def handle(self, *args, **kwargs):
        save_clusters_to_db()
        self.stdout.write(self.style.SUCCESS('Successfully saved clusters to database'))
