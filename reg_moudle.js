async function Register(username, firstname,lastname, city, country,email,interests,question,answer,password) {
	try {
	const user = await getUser(1);
	const interests = await getInterests(user.userId);
	const location = await getLocation(interests[0]);
	console.log(location);
	} catch (error) {
		console.log(error.message);
	}
}

