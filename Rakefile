require "rubygems"
require "bundler/setup"

Bundler.require :default

desc 'Create bundled files for distribution.'
task :bundle do
  version = File.read('VERSION').strip
  
  files = [
    'model.js',
    'model/base.js',
    'model/collection.js',
    'model/associations.js',
    'model/associations/belongs_to.js',
    'model/associations/has_many.js'
  ]
  
  string = files.inject '' do |s, f|
    s << File.read("src/#{f}")
  end
  
  File.open("dist/modelizer-#{version}.js", 'w') do |f|
    f.write string
  end
  
  File.open("dist/modelizer-#{version}-min.js", 'w') do |f|
    f.write Closure::Compiler.new.compile(string)
  end
  
end
