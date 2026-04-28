import os
import requests
def load_env_manually():
    with open('.env', 'r') as f:
        for line in f:
            if '=' in line and not line.startswith('#'):
                key, value = line.strip().split('=', 1)
                os.environ[key] = value

load_env_manually()

TRELLO_API_KEY = os.getenv('TRELLO_API_KEY')
TRELLO_TOKEN = os.getenv('TRELLO_TOKEN')
TRELLO_BOARD_ID = os.getenv('TRELLO_BOARD_ID', 'XIpGmZUV')

def get_trello_lists():
    url = f"https://api.trello.com/1/boards/{TRELLO_BOARD_ID}/lists"
    query = {
        'key': TRELLO_API_KEY,
        'token': TRELLO_TOKEN
    }
    response = requests.get(url, params=query)
    return response.json()

def get_cards_in_list(list_id):
    url = f"https://api.trello.com/1/lists/{list_id}/cards"
    query = {
        'key': TRELLO_API_KEY,
        'token': TRELLO_TOKEN
    }
    response = requests.get(url, params=query)
    return response.json()

def move_card_to_list(card_id, list_id, comment=None):
    url = f"https://api.trello.com/1/cards/{card_id}"
    query = {
        'key': TRELLO_API_KEY,
        'token': TRELLO_TOKEN,
        'idList': list_id
    }
    requests.put(url, params=query)
    
    if comment:
        comment_url = f"https://api.trello.com/1/cards/{card_id}/actions/comments"
        requests.post(comment_url, params={'key': TRELLO_API_KEY, 'token': TRELLO_TOKEN, 'text': comment})

def main():
    lists = get_trello_lists()
    done_list = next((l for l in lists if 'Done' in l['name'] or 'Resolved' in l['name']), None)
    todo_list = next((l for l in lists if 'To Do' in l['name'] or 'Backlog' in l['name']), None)
    
    if not done_list:
        print("Done list not found, using first list available as target.")
        done_list = lists[-1]

    # Bugs to resolve
    bugs = ["Error al publicar", "QR scan failure", "pull from server not working"]
    
    all_cards = []
    for l in lists:
        all_cards.extend(get_cards_in_list(l['id']))
    
    for bug in bugs:
        matching_cards = [c for c in all_cards if bug.lower() in c['name'].lower()]
        for card in matching_cards:
            print(f"Moving card: {card['name']} to {done_list['name']}")
            comment = "Bug Resolved: Supabase project was paused. Service restored and verified."
            move_card_to_list(card['id'], done_list['id'], comment)

if __name__ == "__main__":
    main()
