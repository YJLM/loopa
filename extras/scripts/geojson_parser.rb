class GeoJSONParser
  DEFAULT_OUTPUT = "out.json" 
  ROW_REGEX = /%{(\d+)([a-z])?}/

  require 'csv'
  require 'json'  
  
  attr_accessor :csv_path, :output_path, :skip_headers, :schema
  
  def initialize(csv_path, schema_path,output_path=nil)
    self.csv_path = csv_path
    self.schema = IO.read(schema_path)
    self.skip_headers = true
    self.output_path = output_path || DEFAULT_OUTPUT
  end
  
  def parse    
    feature_collection = {
      type: "FeatureCollection",
      features: []
    }
    contents = CSV.read(self.csv_path)
    contents.slice!(0) if self.skip_headers
    contents.each do |row|
      feature_collection[:features] << parse_row(row)
    end
    File.open(self.output_path, "wb") do |f|
      f.write JSON.generate(feature_collection)
    end
  end
  
  protected 
    def parse_row(row)
      feature = self.schema.clone
      feature.scan(ROW_REGEX).each do |match|
        index = match.first.to_i
        format = match[1]
        if format and format.eql? 'n'
          feature.gsub!("\"%{#{index}#{format}}\"", row[index]) # Remove quotes from numbers   
        else
          feature.gsub!("%{#{index}#{format}}", row[index])          
        end
      end      
      JSON.parse(feature)
    end     
    
end

if ARGV.length >= 2
  parser = GeoJSONParser.new ARGV[0], ARGV[1], ARGV[2]
  parser.parse
else
  p "Usage geojson_parser.rb csv_path schema_path [output_path]"
end
