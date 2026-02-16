# guest-checkin-google-sheet
Quick and dirty guest check in application based on the App Script of Google Sheet. Should be good enough for 200~300 guest.

We built it for our BUETian Alumni Association Calgary's yearly BUET Night event where we have to check in 300~400 guests (including family members).

It takes data from a Google sheet where you have a sheet named Registrations. The Registrations sheet has to have three columns - name, total registration, and total checkin.

Every time you search with a name, it looks for a partial match. If there are multiple entries, it gives you option to choose the right entry. 
The number of check in guest you provide, adds to the total checked in guests for that party (this is particularly helpful when the mom has arrived with the kid but the dad is still parking and will check in few minutes later).

Note that, there is no validation of the guests here because we know the persons and we just want to count how many people (and who) have arrived so far so that we can share this number with the event organizer/restaurant for their billing. 
