# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models




# https://stackoverflow.com/questions/45018277/django-manytomany-through-with-multiple-databases

class Henkilo(models.Model):
    nimi = models.CharField(max_length=5)

    class Meta:
        managed = False
        db_table = 'henkilo'


class Kortti(models.Model):
    teksti = models.CharField(max_length=64)

    henkilot = models.ManyToManyField('Henkilo', through='Oikeudet')

    class Meta:
        managed = False
        db_table = 'kortti'


class Oikeudet(models.Model):
    henkilo = models.ForeignKey(Henkilo, models.DO_NOTHING)
    kortti = models.ForeignKey(Kortti, models.DO_NOTHING)
    hallitsija = models.BooleanField()

    class Meta:
        managed = False
        db_table = 'oikeudet'
        unique_together = (('henkilo', 'kortti'),)
