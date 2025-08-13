from django.shortcuts import render
import requests
from django.conf import settings

def index(request):
    response = requests.get(settings.API_URL)
    posts = response.json()

    total_responses = len(posts)

    votes_product1 = 0
    votes_product2 = 0
    votes_product3 = 0

    # Homogeneizar fecha en posts
    for key, entry in posts.items():
        # Asigna 'timestamp' si no existe pero 'date' sí
        if 'timestamp' not in entry and 'date' in entry:
            entry['timestamp'] = entry['date']

        product = entry.get('productID', '')
        if product == 'product1':
            votes_product1 += 1
        elif product == 'product2':
            votes_product2 += 1
        elif product == 'product3':
            votes_product3 += 1

    data = {
        'title': "Landing Page Dashboard",
        'total_responses': total_responses,
        'votes_product1': votes_product1,
        'votes_product2': votes_product2,
        'votes_product3': votes_product3,
        'posts': posts,  # No olvides enviar posts a la plantilla
    }

    return render(request, 'dashboard/index.html', data)
