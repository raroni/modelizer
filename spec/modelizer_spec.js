describe('Modelizer', function() {
  Modelizer('User');
  
  var user, user_name = 'Rasmus';
  
  beforeEach(function() {
    user = new User({ name: user_name });
  });
  
  it('should be able to get an attribute', function() {
    expect(user.get('name')).toEqual(user_name);
  });
  
  it('should mark changed attribute (updated via #update) as changed', function() {
    user.update({ age: 24, name: 'John' });
    expect(user.changed('name')).toBeTruthy();
  });
  
  it('should mark changed attribute (updated via #set) as changed', function() {
    user.set('age', 24);
    expect(user.changed('age')).toBeTruthy();
  });
  
  it('should mark not updated attributes as not changed', function() {
    user.set('age', 24);
    expect(user.changed('name')).toBeFalsy();
  });
  
  it('should not mark a unchanged attribute as changed', function() {
    user.update({ age: 24 });
    expect(user.changed('name')).toBeFalsy();
  });
  
  it('should mark instantiation attributes as changed', function() {
    expect(user.changed('name')).toBeTruthy();
  });

});
