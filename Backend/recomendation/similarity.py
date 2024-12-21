from django.db.models import Count
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import pandas as pd

from cart.models import Cart
from notification.views import send_notification, send_notifications
from user.models import User

def compute_user_similarity():
    # Step 1: Create a user-product interaction matrix
    data = Cart.objects.filter(status=Cart.ORDERED).values("UID", "PID").annotate(count=Count("PID"))

    # Convert the data into a pandas DataFrame
    df = pd.DataFrame(data)
    interaction_matrix = df.pivot(index="UID", columns="PID", values="count").fillna(0)

    # Step 2: Calculate user similarity (cosine similarity)
    user_similarity = cosine_similarity(interaction_matrix)

    # Convert similarity into a DataFrame
    user_similarity_df = pd.DataFrame(user_similarity, index=interaction_matrix.index, columns=interaction_matrix.index)

    # Step 3: Generate recommendations
    recommendations = []
    for user in interaction_matrix.index:
        similar_users = user_similarity_df[user].sort_values(ascending=False).iloc[1:6]  # Top 5 similar users
        similar_user_ids = similar_users.index

        # Find products these similar users purchased but the current user has not
        similar_users_products = interaction_matrix.loc[similar_user_ids].sum()
        user_products = interaction_matrix.loc[user]
        recommended_products = similar_users_products[user_products == 0].sort_values(ascending=False)

        # Store recommendations
        for product_id in recommended_products.index[:5]:  # Top 5 products
            recommendations.append({
                "UID": user,
                "PID": product_id,
            })

    # Step 4: Save recommendations to the database
    for rec in recommendations:
        print(User.objects.get(pk=rec['UID'])," send notification ",rec['PID'])
        send_notifications(User.objects.get(pk=rec['UID']),"You have a new product suggession",f"/product/{rec['PID']}")
        send_notification("You have a new product suggession")
        # Recommendation.objects.create(
        #     UID_id=rec["UID"],
        #     PID_id=rec["PID"]
        # )

    


