from django.shortcuts import redirect

from django.contrib.auth.decorators import user_passes_test
from django.core.exceptions import PermissionDenied

from django.contrib.auth.decorators import login_required
from django.core.exceptions import PermissionDenied

def unauthenticated_user(view_func):
    def wrapper_func(request, *args, **kwargs):
        if request.user.is_authenticated:
            redirect_url = f'/seller/dashboard/'
            return redirect(redirect_url)
        else:
            return view_func(request, *args, **kwargs)
    return wrapper_func