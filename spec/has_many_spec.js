describe('HasMany', function() {
  beforeEach(function() {
    Modelizer('User').hasMany('songs');
    Modelizer('Song');
  });
  
  it('should try to update an existing models before creating a new one', function() {
    new Song({ id: 1, title: 'Twist and Shout' });
    new User({
      id: 1,
      songs: {
        id: 1,
        title: 'Ticket To Ride'
      }
    });
    
    expect(Song.first().get('title')).toEqual('Ticket To Ride');
  });
  
});
