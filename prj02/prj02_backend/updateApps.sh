#!/bin/bash

git remote rm heroku
heroku git:remote -a veff2023-h1
git commit --allow-empty -am "Auto updated to new version."
git push heroku master

git remote rm heroku
heroku git:remote -a veff2023-h2
git commit --allow-empty -am "Auto updated to new version."
git push heroku master

git remote rm heroku
heroku git:remote -a veff2023-h3
git commit --allow-empty -am "Auto updated to new version."
git push heroku master

git remote rm heroku
heroku git:remote -a veff2023-h4
git commit --allow-empty -am "Auto updated to new version."
git push heroku master

git remote rm heroku
heroku git:remote -a veff2023-h5
git commit --allow-empty -am "Auto updated to new version."
git push heroku master

git remote rm heroku
heroku git:remote -a veff2023-h6
git commit --allow-empty -am "Auto updated to new version."
git push heroku master

git remote rm heroku
heroku git:remote -a veff2023-hmv-aku
git commit --allow-empty -am "Auto updated to new version."
git push heroku master
