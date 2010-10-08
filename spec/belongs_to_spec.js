describe('BelongsTo', function() {
  beforeEach(function() {
    Modelizer('User');
    Modelizer('Song').belongsTo('user');
  });
  
  it('should update an existing model if one with the same id is present', function() {
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
  
});
