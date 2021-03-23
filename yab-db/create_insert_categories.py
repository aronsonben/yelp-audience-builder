import psycopg2
# import list of 'restaurant' category titles
from categories import restaurant_categories, restaurant_aliases, restaurant_categories_aliases

# Get category list
categories2 = restaurant_categories
categories_alias = restaurant_categories_aliases
aliases = restaurant_aliases

# # "host" came from checking IP Address via `docker inspect yabdb_docker`
# conn = psycopg2.connect(database='yab_db',
#        user='postgres',
#        password='Yelp20',
#        host='172.28.0.2')

# cursor = conn.cursor()


def parse_aliases(cat_alias):
    category_tuple_list = []
    for cat in cat_alias:
        p = cat.partition(';')
        category_tuple_list.append((p[0], p[2].strip('()')))  
    return category_tuple_list    


def get_categories():
    categ_alias = parse_aliases(categories_alias)
    return categ_alias

def create_insert_statement():
    insert_file = open('insert_categories.sql', 'w')
    categories_alias_list = get_categories()
    id_num = 1
    for ca in categories_alias_list:
        # print(id_num, ca[0], ca[1])
        insert_file.write("INSERT INTO categories (category_id, category_name, alias) VALUES ({}, '{}', '{}');\n".format(id_num, ca[0], ca[1]))
        id_num += 1
    insert_file.close()



print(create_insert_statement())