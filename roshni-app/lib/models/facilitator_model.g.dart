// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'facilitator_model.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

class FacilitatorAdapter extends TypeAdapter<Facilitator> {
  @override
  final int typeId = 4;

  @override
  Facilitator read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return Facilitator(
      firstname: fields[0] as String,
      lastname: fields[1] as String,
      dob: fields[2] as String,
      email: fields[3] as String,
      evalID: fields[4] as String,
      loc: fields[5] as String,
      password: fields[6] as String,
    );
  }

  @override
  void write(BinaryWriter writer, Facilitator obj) {
    writer
      ..writeByte(8)
      ..writeByte(0)
      ..write(obj.firstname)
      ..writeByte(1)
      ..write(obj.lastname)
      ..writeByte(2)
      ..write(obj.dob)
      ..writeByte(3)
      ..write(obj.email)
      ..writeByte(4)
      ..write(obj.evalID)
      ..writeByte(5)
      ..write(obj.loc)
      ..writeByte(6)
      ..write(obj.password)
      ..writeByte(7)
      ..write(obj.key);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is FacilitatorAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
