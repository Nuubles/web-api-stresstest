# This file is used by Rack-based servers to start the application.

require_relative "config/environment"

run Rails.application
Rails.application.config.hosts = nil
Rails.application.load_server
