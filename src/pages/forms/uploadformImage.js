// async uploadImage(user, image) {
//   this.logger.info(`Entering method uploadImage.
//   Parameters: user=${user}, image=${image}`);

//   // Create a reference to where we're going to save the client's image
//   var storageRef = firebase.storage().ref();
//   var imageRef = storageRef.child("images/" + user.uid + "/" + Guid.create());
//   const blob = await (await fetch(image)).blob();

//   // Save the clients image and get the download url
//   let snapshot = await imageRef.put(blob);
//   console.log(snapshot);
//   const downloadUrl = await snapshot.ref.getDownloadURL();
//   this.formResponse["client_image"] = downloadUrl;

//   this.logger.info("Exiting method uploadImage");
//   return;
// }
