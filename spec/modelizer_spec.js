describe('Modelizer', function() {
  beforeEach(function() {
    Modelizer('User');
  });
  
  it('should thrown an exception if two models with the same id is instantiated', function() {
    new User({ id: 1 });
    expect(function() { new User({ id: 1 }) }).toThrow('Cannot create two models with the same ID. (User, 1)');
  });
});
