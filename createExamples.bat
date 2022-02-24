@echo off
for /l %%a in (1,1,15) do (
   >>2022-04-%%a.md echo ---
   >>2022-04-%%a.md echo moneySpent: 275
   >>2022-04-%%a.md echo exercise: 30 minutes
   >>2022-04-%%a.md echo alcohol: 30 minutes
   >>2022-04-%%a.md echo ---
   >>2022-04-%%a.md echo ## day no %%a
   >>2022-04-%%a.md echo today is a good day!
   >>2022-04-%%a.md echo i went to the park with my friend [person/greg: 1 hours 15 minutes]
   >>2022-04-%%a.md echo 
   >>2022-04-%%a.md echo i did some writing [writing:: true]
   >>2022-04-%%a.md echo 
   >>2022-04-%%a.md echo lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum
)