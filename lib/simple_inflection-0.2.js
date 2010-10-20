var SimpleInflection = (function() {
  var _uncountable_words = [
    'equipment','information','rice','money','species','series','fish','sheep',
    'moose','deer','news'
  ];
  
  var _singular_rules = [
    [new RegExp('(m)en$','gi'),'$1an'],
    [new RegExp('(pe)ople$','gi'),'$1rson'],
    [new RegExp('(child)ren$','gi'),'$1'],
    [new RegExp('([ti])a$','gi'), '$1um'],
    [new RegExp('((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$',
      'gi'),'$1$2sis'],
    [new RegExp('(hive)s$','gi'), '$1'],
    [new RegExp('(tive)s$','gi'), '$1'],
    [new RegExp('(curve)s$','gi'), '$1'],
    [new RegExp('([lr])ves$','gi'), '$1f'],
    [new RegExp('([^fo])ves$','gi'), '$1fe'],
    [new RegExp('([^aeiouy]|qu)ies$','gi'), '$1y'],
    [new RegExp('(s)eries$','gi'), '$1eries'],
    [new RegExp('(m)ovies$','gi'), '$1ovie'],
    [new RegExp('(x|ch|ss|sh)es$','gi'), '$1'],
    [new RegExp('([m|l])ice$','gi'), '$1ouse'],
    [new RegExp('(bus)es$','gi'), '$1'],
    [new RegExp('(o)es$','gi'), '$1'],
    [new RegExp('(shoe)s$','gi'), '$1'],
    [new RegExp('(cris|ax|test)es$','gi'), '$1is'],
    [new RegExp('(octop|vir)i$','gi'), '$1us'],
    [new RegExp('(alias|status)es$','gi'), '$1'],
    [new RegExp('^(ox)en','gi'), '$1'],
    [new RegExp('(vert|ind)ices$','gi'), '$1ex'],
    [new RegExp('(matr)ices$','gi'), '$1ix'],
    [new RegExp('(quiz)zes$','gi'), '$1'],
    [new RegExp('s$','gi'), '']
  ];
  
  return {
    'camelize': function(str) {
      var substrings = str.split('_');
      for(var i = 0; i < substrings.length; i++) {
        substrings[i] = substrings[i].charAt(0).toUpperCase() + substrings[i].substring(1);
      }
      return substrings.join('');
    },
    'singularize': function(str) {
      var uncountable=false;
      for(var i = 0; !uncountable && i < _uncountable_words.length; i++) {
        uncountable = (_uncountable_words[i] == str.toLowerCase());
      }
      if(!uncountable) {
        var matched = false;
        for(var j = 0; !matched && j < _singular_rules.length; j++) {
          matched = str.match(_singular_rules[j][0]);
          if(matched) {
            str = str.replace(_singular_rules[j][0], _singular_rules[j][1]);
          }
        }
      }
      return str;
    },
    'classify': function(str) {
      return this.singularize(this.camelize(str));
    },
    'underscore': function(str) {
      var upCase = new RegExp('([ABCDEFGHIJKLMNOPQRSTUVWXYZ])','g');
      var fb = new RegExp('^_');
      return str.replace(upCase,'_$1').replace(fb,'').toLowerCase();
    }
  };
})();
