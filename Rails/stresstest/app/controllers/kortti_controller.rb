class KorttiController < ApplicationController
    def index
        @kortti = Array(Henkilo.where(id: params[:userId]).joins(:kortti).select('kortti.id, kortti.teksti, oikeudet.hallitsija'))

        # push and sort
        @kortti.push({:id => -1, :teksti => "This is a template card", :hallitsija => true})
        @kortti = @kortti.sort_by{ |a| a[:teksti] }

        # respond
        respond_to :json
        render json: @kortti
    end
end
