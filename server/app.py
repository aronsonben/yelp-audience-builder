from flask import Flask
from flask import jsonify
from flask import request
import os
import json
import psycopg2
import requests
import config
from helper import get_category_data, build_business_json, build_user_json


app = Flask(__name__)
conn = psycopg2.connect(database=config.DB,
    user=config.DB_USER,
    password=config.DB_PASS,
    host=config.DB_HOST
)

cursor = conn.cursor()

'''
    Function to create User objects to place in database. Parameter 'reviews' is a list of JSON-formatted reviews 
    containing information on the users who wrote them. I will extract information from that. 
'''
def create_users(business, category, reviews):
    cat_data = get_category_data(cursor, category)
    if cat_data is None:
        return "Failed... invalid category"

    user_list = []
    
    for review in reviews:
        if review is not None:
            user_json = build_user_json(review, business, category)
            user_list.append(user_json)

    return user_list


######## ROUTES ################################################################################

@app.route('/')
def hello():
    cursor.close()
    conn.close()
    return 'Hello World!'



## Categories ## ===============================================================================

# Starting logic on gathering category list
@app.route("/categories")
def categories():
    cursor.execute("SELECT * FROM categories;")
    category_alias_list = cursor.fetchall()
    ca_dict = {}
    for c in category_alias_list:
        ca_dict[c[1]] = c[2]
    # print(ca_dict)
    return ca_dict

'''
    Special function for front-end. Creating both in case front-end malfunctions.
'''
@app.route("/categories/f", methods=['GET'])
def categories_frontend():
    cats = []
    aliases = []
    print("categories")
    cursor.execute("SELECT * FROM categories;")
    category_alias_list = cursor.fetchall()
    ca_dict = {}
    for c in category_alias_list:
        ca_dict[c[1]] = c[2]
        cats.append(c[1])
        aliases.append(c[2])
    # print(ca_dict)
    return jsonify(categories=cats, aliases=aliases, categoryMap=[ca_dict])



## Businesses ## ===============================================================================

'''
    Find businesses by category - backend solution. NOT using request.
'''
@app.route("/business/<category>", methods=['GET'])
def find_businesses_by_category(category):
    # print("====== searching for... ", category)
    addr = '1334 E St SE, Washington, DC 20003'
    request_params = {
        'location': addr,
        'categories': category
    }
    authString = 'Bearer ' + os.environ.get('YELP_KEY')
    response = requests.get(
        'https://api.yelp.com/v3/businesses/search',
        params=request_params,
        headers={'Authorization': authString}
    )
    resp = {}
    if response.status_code != 200:
        return "failed"
    else: 
        json_resp = response.json()

    # Building Business objects to put into Db
    business_objs = []
    for b in json_resp['businesses']:
        obj = {}
        obj['id'] = b['id']
        obj['name'] = b['name']
        obj['alias'] = b['alias']
        obj['rating'] = b['rating']

        obj['location'] = ''
        if b['location']['display_address'] != None:
            for addr in b['location']['display_address']:
                obj['location'] = obj['location'] + " " + addr
       
        obj['categories'] = []
        for c in b['categories']:
            obj['categories'].append(c['alias'])
        
        # Append object to list for easier parsing
        business_objs.append(obj)

    business_ret = {}
    business_ret['businesses'] = business_objs
    business_ret['category'] = category
    return business_ret


'''
    Front end version of business search
'''
@app.route("/search/business", methods=['GET'])
def search_business_frontend():
    # print("====== searching for... ", request.args.get('category'))
    category = request.args.get('category')
    addr = request.args.get('address')

    if addr is None or addr == '':
        addr = '1334 E St SE, Washington, DC 20003'

    request_params = {
        'location': addr,
        'categories': category
    }

    authString = 'Bearer ' + os.environ.get('YELP_KEY')
    response = requests.get(
        'https://api.yelp.com/v3/businesses/search',
        params=request_params,
        headers={'Authorization': authString}
    )
    resp = {}
    if response.status_code != 200:
        return "failed"
    else: 
        json_resp = response.json()

    # Building Business objects to put into Db
    business_objs = []
    for b in json_resp['businesses']:
        obj = {}
        obj['id'] = b['id']
        obj['name'] = b['name']
        obj['alias'] = b['alias']
        obj['rating'] = b['rating']

        obj['location'] = ''
        if b['location']['display_address'] != None:
            for addr in b['location']['display_address']:
                obj['location'] = obj['location'] + " " + addr
       
        obj['categories'] = []
        for c in b['categories']:
            obj['categories'].append(c['alias'])
        
        # Append object to list for easier parsing
        business_objs.append(obj)

    return jsonify(businesses=business_objs)



## Users ## ======================================================================================

'''
    This function calls the /businesses/{id}/reviews endpoint from the Yelp API
'''
@app.route("/users/<category>", methods=['GET'])
def find_users_by_category(category):
    # print("=== searching for... " + category, flush=True)
    businesses = find_businesses_by_category(category)
    category_data = get_category_data(cursor, category)

    # Set up return variable
    users = {}
    users['category'] = category
    users['users'] = []

    if businesses != []:
        for biz in businesses['businesses']:
            # print("== Getting reviews for biz: {}".format(biz['name']), flush=True)
            # Get reviews for this 'biz' business
            authString = 'Bearer ' + os.environ.get('YELP_KEY')
            endpoint = 'https://api.yelp.com/v3/businesses/{}/reviews'.format(biz['id'])
            response = requests.get(
                endpoint,
                headers={'Authorization': authString}
            )
            json_resp = {}
            if response.status_code != 200:
                # print("===failed request for reviews!")         # improve fail response
                return response.text
            else: 
                json_resp = response.json()

            # Create and save User profiles
            created_users = create_users(biz, category, json_resp['reviews'])
            for u in created_users:
                users['users'].append(u)
    else:
        users = {}
        users['users'] = []
        return users

    return users
    



'''
    The official search function. It will take a category & address, search for businesses by that category 
    and then return a list of users who have reviewed those businesses.
'''
@app.route("/search/<category>", methods=['GET'])
def search(category):
    print("====== searching for... " + category, flush=True)
    if get_category_data(cursor, category) is None:
        return "Invalid category, please try again."
    
    # Find Businesses by category
    businesses = find_businesses_by_category(category)

    # Find Users by list of Businesses
    users = find_users_by_category(category)

    users['businesses'] = businesses['businesses']

    return users


'''
    Search for users by category - frontend version.
'''
@app.route("/search/users", methods=['GET'])
def search_frontend():
    print("====== searching for... " + request.args.get('category'), flush=True)
    category = request.args.get('category')
    addr = request.args.get('address')

    # Find Businesses by category
    businesses = find_businesses_by_category(category)
    # Find Users by list of Businesses
    users = find_users_by_category(category)

    users['businesses'] = businesses['businesses']

    return users

