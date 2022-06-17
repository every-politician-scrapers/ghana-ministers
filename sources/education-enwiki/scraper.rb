#!/bin/env ruby
# frozen_string_literal: true

require 'every_politician_scraper/scraper_data'
require 'pry'

class OfficeholderList < OfficeholderListBase
  decorator RemoveReferences
  decorator UnspanAllTables
  # decorator WikidataIdsDecorator::Links

  def header_column
    'Number'
  end

  class Officeholder < OfficeholderBase
    def columns
      %w[ordinal name start end].freeze
    end

    def empty?
      tds[2].text.tidy.empty? || tds[3].text.tidy.empty? || too_early?
    end
  end
end

url = ARGV.first
puts EveryPoliticianScraper::ScraperData.new(url, klass: OfficeholderList).csv
