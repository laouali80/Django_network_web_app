from django import forms

from django.core.validators import MinValueValidator



class NewPostForm(forms.Form):
    content = forms.CharField(widget=forms.Textarea, label="New Post")

    def __init__(self, *args, **kwargs):
        super(NewPostForm, self).__init__(*args, **kwargs)
        for visible in self.visible_fields():
            visible.field.widget.attrs['class'] = 'form-control'