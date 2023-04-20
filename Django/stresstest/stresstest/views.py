from django.http import JsonResponse
from django.db.models import F, Subquery
from django.forms.models import model_to_dict
from django.core import serializers
from . import models

templatecard = {
    'id': -1,
    'teksti': "This is a template card",
    'hallitsija': True
}

def cards(request, userId):
    global templatecard
    cards = list(models.Kortti.objects.filter(oikeudet__henkilo_id=userId).annotate(hallitsija=F('oikeudet__hallitsija')).values())
    cards.append(templatecard)
    cards.sort(key = lambda x: x['teksti'])
    return JsonResponse(cards, safe=False)
