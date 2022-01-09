#!/bin/env ruby
# frozen_string_literal: true

require 'every_politician_scraper/scraper_data'
require 'pry'

class OfficeholderList < OfficeholderListBase
  decorator RemoveReferences
  decorator UnspanAllTables
  decorator WikidataIdsDecorator::Links

  def header_column
    'Number'
  end

  class Officeholder < OfficeholderBase
    def columns
      %w[ordinal name start end].freeze
    end

    def empty?
      raw_end.include?('?') || raw_start.include?('?') || raw_start.include?('c. ')
    end
  end
end

url = ARGV.first
puts EveryPoliticianScraper::ScraperData.new(url, klass: OfficeholderList).csv
