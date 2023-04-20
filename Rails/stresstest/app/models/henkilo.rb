class Henkilo < ApplicationRecord
    self.table_name = 'henkilo'
    has_many :oikeudet
    has_many :kortti, through: :oikeudet
end