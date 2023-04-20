from rest_framework import serializers
from .models import HenkiloModel, KorttiModel

class HenkiloSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = HenkiloModel
        fields = ('title', 'description')

class KorttiSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = KorttiModel
        fields = ('title', 'description')