import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ViewController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { Angular2Apollo } from 'angular2-apollo';
import { Subscription } from 'rxjs/Subscription'
import gql from 'graphql-tag';
import 'rxjs/add/operator/toPromise';


@IonicPage()
@Component({
  selector: 'page-add-squeel',
  templateUrl: 'add-squeel.html',
})
export class AddSqueelPage {

  form: FormGroup;
  currentUser = <any>{};
  team: any = "";

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public apollo: Angular2Apollo, public formBuilder: FormBuilder,public toastCtrl: ToastController) {

    this.currentUserInfo().then(({data}) => {
      this.currentUser = data;
      this.currentUser = this.currentUser.user;
    });
    this.form = formBuilder.group({
     description: ['', Validators.required],
     category: ['', Validators.required]
    });
  }

  cancel() {
    this.viewCtrl.dismiss();
  }
  selectTeam1() {
    this.team = "team1";
  }
  selectTeam2() {
    this.team = "team2";
  }

  currentUserInfo(){
   return this.apollo.query({
     query: gql`
       query{
         user{
           id
           profileUrl
           name
         }
       }
     `
   }).toPromise();
 }
 squeel() {
   if (!this.form.value.description) {
     let toast = this.toastCtrl.create({
        message: 'There is some information missing. Try again.',
        duration: 3000,
        position: 'top'
      });
      toast.present();
      return;
   }
   if (!this.team) {
     let toast = this.toastCtrl.create({
        message: 'Please select your team',
        duration: 3000,
        position: 'top'
      });
      toast.present();
      return;
   }
   this.apollo.mutate({
    mutation: gql`
    mutation createSqueel($description: String!,
                        $userId: ID!,
                        $team: Int){
      createSqueel(description: $description, userId: $userId, team: $team){
                    id
                  }
                }
    `,
    variables: {
      description: this.form.value.description,
      userId: this.currentUser.id,
      team: (this.team == "team1") ? 1 : 2
    }
  }).toPromise().then(({data}) => {
    this.form.value.description = "";
    let toast = this.toastCtrl.create({
       message: 'Squeel created successfully!',
       duration: 3000,
       position: 'top'
     });
     toast.present();
     this.viewCtrl.dismiss();
  });
 }

}
