describe('Modelizer', function() {
  Modelizer('User');
  
  var user, user_name = 'Rasmus';
  
  beforeEach(function() {
    user = new User({ name: user_name });
  });
  
  it('should be able to get an attribute', function() {
    expect(user.get('name')).toEqual(user_name);
  });
  
  it('should mark a changed attribute as changed', function() {
    user.update({ age: 24, name: 'John' });
    expect(user.changed('name')).toBeTruthy();
  });
  
  it('should not mark a unchanged attribute as changed', function() {
    user.update({ age: 24 });
    expect(user.changed('name')).toBeFalsy();
  });

});
