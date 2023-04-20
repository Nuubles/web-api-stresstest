class ClockController < ApplicationController
    @@clients = []
    def connect
        if Faye::WebSocket.websocket?(request.env)
            ws = Faye::WebSocket.new(request.env)

            ws.on :open do |event|
                # Code to execute when the websocket connection is opened
                @@clients << ws
            end

            ws.on :message do |event|
                if event.data == 'requestTime'
                    now = Time.now
                    @@clients.each do |client|
                        client.send(now.to_s)
                    end
                end
            end

            ws.on :close do |event|
                # Code to execute when the websocket connection is closed
                @@clients.delete(ws)
                ws = nil
            end

            # Return async Rack response
            return ws.rack_response
        else
            # Return regular HTTP response
            render text: 'Not a websocket request'
        end
    end
end
