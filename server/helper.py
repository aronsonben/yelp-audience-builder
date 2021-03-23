'''
    Function used to get category data from the alias passed in request
'''
def get_category_data(cursor, alias):
    # If the alias is not in the db, simply skip it
    cursor.execute("SELECT * FROM categories WHERE alias = %s", (alias,))
    category = cursor.fetchone()
    if category is None:
        return None
    else: 
        return category

'''
    TODO: Get other categories from the mapping table. Right now I only retrieve one biz per one cat.
    Expecting 'biz' to be a tuple representing a Business record, retrieved from 'businesses' db table.
    ex: ('aQixu79jxjpa91', 'Da Hong Pao', 'dahongpao', 4.0, '123 Main St, Washington, DC')
'''
def build_business_json(biz):
    if biz is None:
        return "INVALID BUSINESS (build_business_json)"
    business = {}
    business['id'] = biz[0]
    business['name'] = biz[1]
    business['alias'] = biz[2]
    business['rating'] = str(biz[3])    # Note: This is a bit of a hack in order to represent Decimal in JSON form
    business['location'] = biz[4]
    return business

def build_user_json(review, business, category):
    if review is None:
        return "INVALID USER (build_user_json)"

    user = review['user']
    user['rating'] = review['rating']
    user['business'] = business['name']
    user['category'] = category

    # new_user = {}
    # new_user['id'] = user[0]
    # new_user['name'] = user[1]
    # new_user['rating'] = user[2]
    # new_user['profile_url'] = user[3]
    # Get business
    # biz_id = user[4]
    
    return user