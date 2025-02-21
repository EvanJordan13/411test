from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import pandas as pd
import string

options = webdriver.ChromeOptions()
options.add_argument("--headless=new")
driver = webdriver.Chrome(options=options)

firstName = []
lastName = []
position = []
yearBegin = []
yearEnd = []
urls = []

for letter in string.ascii_uppercase:
    url = f"https://www.pro-football-reference.com/players/{letter}/"
    driver.get(url)
    player_urls = driver.find_elements("css selector", "#div_players>p a")
    player_info = driver.find_elements("css selector", "#div_players>p")
    ct = 0
    for purls in player_urls:
        urls.append(purls.get_attribute("href"))
    for info in player_info:
        info = info.text
        fields = info.split(' ')
        x = len(fields) - 4
        firstName.append(fields[0])
        lastName.append(fields[1+x])
        position.append(fields[2+x][1:-1])
        years = fields[3+x].split('-')
        yearBegin.append(years[0])
        yearEnd.append(years[1])
driver.close()

df = pd.DataFrame({"FirstName": firstName, "LastName": lastName, "Position": position, "YearBegin": yearBegin, "YearEnd": yearEnd, "URL": urls})
df = df[(df.Position == "QB") | (df.Position == "RB") | (df.Position == "WR") | (df.Position == "TE")]
df["YearBegin"] = df["YearBegin"].astype(int)
df["YearEnd"] = df["YearEnd"].astype(int)
df = df[df.YearEnd > 2015]
df = df.reset_index()
df.to_csv("../data/player_info.csv")