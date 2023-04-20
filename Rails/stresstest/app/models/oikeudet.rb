class Oikeudet < ApplicationRecord
    self.table_name = 'oikeudet'
    belongs_to :henkilo
    belongs_to :kortti
end