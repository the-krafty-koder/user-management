import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { FirebaseService } from '../shared/firebase/firebase.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  public db: FirebaseFirestore.Firestore;

  constructor(private readonly firebaseService: FirebaseService) {}

  onModuleInit() {
    this.db = this.firebaseService.getFirestore();
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const emailQuerySnapshot = await this.db
        .collection('users')
        .where('email', '==', createUserDto.email)
        .get();

      if (!emailQuerySnapshot.empty) {
        throw new BadRequestException('Email already exists');
      }

      const userRef = await this.db.collection('users').add(createUserDto);
      const userSnapshot = await userRef.get();
      return { id: userSnapshot.id, ...userSnapshot.data() };
    } catch (error) {
      throw error;
    }
  }

  async findAll(limit = 10, startAfter?: string) {
    let query = this.db.collection('users').orderBy('name').limit(limit);

    if (startAfter) {
      const doc = await this.db.collection('users').doc(startAfter).get();
      if (doc.exists) {
        query = query.startAfter(doc);
      }
    }

    const snapshot = await query.get();
    const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    // Get the next page token (last user ID)
    const nextPageToken =
      users.length > 0 ? users[users.length - 1].id : undefined;

    return { users, nextPageToken };
  }

  async findOne(id: string) {
    try {
      const userDoc = await this.db.collection('users').doc(id).get();
      if (!userDoc.exists) {
        throw new BadRequestException(`User with ID ${id} not found`);
      }
      return { id: userDoc.id, ...userDoc.data() };
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const userDoc = await this.db.collection('users').doc(id).get();
      if (!userDoc.exists) {
        throw new BadRequestException(`User with ID ${id} not found`);
      }

      const existingUserData = userDoc.data();

      if (
        updateUserDto.email &&
        existingUserData &&
        updateUserDto.email !== existingUserData.email
      ) {
        throw new BadRequestException('Email cannot be updated');
      }
      const updateObject = JSON.parse(JSON.stringify(updateUserDto));
      await this.db.collection('users').doc(id).update(updateObject);
      return this.findOne(id);
    } catch (error) {
      throw error;
    }
  }
}
