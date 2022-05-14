#!/bin/env ruby
# frozen_string_literal: true

require 'every_politician_scraper/scraper_data'
require 'pry'

require 'open-uri/cached'

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

    def ignore_before
      1998
    end

    def empty?
      tds[2].text.to_s.empty? || super
    end
  end
end

url = ARGV.first
puts EveryPoliticianScraper::ScraperData.new(url, klass: OfficeholderList).csv
