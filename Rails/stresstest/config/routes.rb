Rails.application.routes.draw do
  get '/users/:userId/cards', to: 'kortti#index'
  get '/clock', to: 'clock#connect', via: :all
end
