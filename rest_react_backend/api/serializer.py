from rest_framework import serializers

from .models import Post, Comment, User

class PostSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')
    class Meta:
        model = Post
        fields = [ 'id', 'user', "username",'time', 'content', 'liked_by']
        read_only_fields = ['user', 'id', 'time', 'liked_by', "username"]

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)



class CommentSerializer(serializers.ModelSerializer):
    post = serializers.HyperlinkedRelatedField(view_name='PostUDR', read_only=True)
    username = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = Comment
        fields = ['id', 'user',"username", 'post', 'time', 'content', 'liked_by']
        read_only_fields = ['id', 'user',"username", 'post', 'time', 'liked_by']



class UserSerializer(serializers.ModelSerializer):
    followers = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    following = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    # posts = PostSerializer(many=True, read_only=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'followers', 'following']
        read_only_fields = ['id', 'username', 'email', 'followers', 'following']