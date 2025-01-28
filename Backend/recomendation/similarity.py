from django.db.models import Count
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import pandas as pd

from cart.models import Cart
from notification.views import send_notification, send_notifications
from user.models import User
import time

def compute_user_similarity(user_ID):
    # time.sleep(5)
    data = Cart.objects.filter(status=Cart.ORDERED).values("UID", "PID").annotate(count=Count("PID"))

    df = pd.DataFrame(data)
    interaction_matrix = df.pivot(index="UID", columns="PID", values="count").fillna(0)

    user_similarity = cosine_similarity(interaction_matrix)
    user_similarity_df = pd.DataFrame(user_similarity, index=interaction_matrix.index, columns=interaction_matrix.index)
    print(len(user_similarity),"  ", user_similarity_df)
    recommendations = []
    for user in interaction_matrix.index:
        similar_users = user_similarity_df[user].sort_values(ascending=False).iloc[1:6]  # Top 5 similar users
        similar_user_ids = similar_users.index

        similar_users_products = interaction_matrix.loc[similar_user_ids].sum()
        user_products = interaction_matrix.loc[user]
        recommended_products = similar_users_products[user_products == 0].sort_values(ascending=False)

        
        for product_id in recommended_products.index[:5]:  # Top 5 products
            recommendations.append({
                "UID": user,
                "PID": product_id,
            })

    print(recommendations," here are the detail written ")
    if recommendations:  
        first_rec = recommendations[0] 
        user = User.objects.get(pk=user_ID)
        # print(User.objects.get(pk=rec['UID'])," send notification ",rec['PID'])
        # send_notification("You have a new product suggession")
        send_notifications(user,"You have a new product suggession",f"/product/{first_rec['PID']}")
        
        # Recommendation.objects.create(
        #     UID_id=rec["UID"],
        #     PID_id=rec["PID"]
        # )

    


