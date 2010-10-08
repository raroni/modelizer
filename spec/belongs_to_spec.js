describe('BelongsTo', function() {
  beforeEach(function() {
    Modelizer('User');
    Modelizer('Song').belongsTo('user');
  });
  
  it('should attempt to update existing model before creating a new one', function() {
    new User({ id: 1, name: 'Rasmus' });
    new Song({
      id: 1,
      name: 'Blackbird',
      user: {
        id: 1,
        name: 'John'
      }
    });

    expect(User.first().get('name')).toEqual('John');
  });
  
  it('should not affect existing associated model\'s id', function() {
    new User({ id: 1, name: 'Rasmus' });
    new Song({
      id: 1,
      title: 'Blackbird',
      user: {
        id: 1
      }
    });

    expect(User.first().get('id')).toEqual(1);
  });
  
});
