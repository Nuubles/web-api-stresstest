class Kortti < ApplicationRecord
    self.table_name = 'kortti'
    has_many :oikeudet
    has_many :henkilo, through: :oikeudet
end