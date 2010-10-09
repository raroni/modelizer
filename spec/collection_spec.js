describe('Collection', function() {
  beforeEach(function() {
    Modelizer('User');
  });

  it('should create a model if matching model does not exist when using createOrUpdate', function() {
    var user_name = 'Rasmus';
    User.createOrUpdate({ id: 1, name: user_name });
    expect(User.first().get('name')).toEqual(user_name);
  });
  
  it('should update matching model if it exists when using createOrUpdate', function() {
    var u = new User({ id: 1 });
    var user_name = 'Rasmus';
    User.createOrUpdate({ id: 1, name: user_name });
    expect(u.get('name')).toEqual(user_name);
  });
});
